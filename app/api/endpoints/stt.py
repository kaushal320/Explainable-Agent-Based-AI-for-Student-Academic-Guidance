from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
import httpx
import tempfile
import subprocess
import json
import wave

router = APIRouter()

try:
    from vosk import Model, KaldiRecognizer
    VOSK_AVAILABLE = True
except Exception:
    VOSK_AVAILABLE = False


def _resolve_ffmpeg_executable():
    env_candidates = [os.getenv("FFMPEG_BINARY"), os.getenv("FFMPEG_PATH")]
    for candidate in env_candidates:
        if not candidate:
          continue
        if os.path.isfile(candidate):
            return candidate
        resolved = shutil.which(candidate)
        if resolved:
            return resolved

    system_ffmpeg = shutil.which("ffmpeg")
    if system_ffmpeg:
        return system_ffmpeg

    try:
        import imageio_ffmpeg

        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        if ffmpeg_exe and os.path.exists(ffmpeg_exe):
            return ffmpeg_exe
    except Exception:
        pass

    return None


@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """Accept an audio file and return a transcript.

    Behavior:
    - If `OPENAI_API_KEY` is set, proxy to OpenAI Whisper API (existing behavior).
    - Otherwise, if the `vosk` package and a local model are available, perform
      offline transcription locally using Vosk + ffmpeg for audio conversion.
    - If neither path is possible, return 501 with instructions for a free
      offline setup (install `vosk`, `ffmpeg`, and download a Vosk model).
    """
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
    contents = await file.read()

    # If API key present, prefer remote Whisper (Groq or OpenAI)
    if api_key:
        headers = {"Authorization": f"Bearer {api_key}"}
        # Use whisper-large-v3 for Groq, fallback to whisper-1 if using OpenAI key
        model_name = "whisper-large-v3" if "gsk_" in api_key else "whisper-1"
        # Determine base URL
        base_url = "https://api.groq.com/openai/v1/audio/transcriptions" if "gsk_" in api_key else "https://api.openai.com/v1/audio/transcriptions"
        
        data = {"model": model_name}
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                files = {"file": (file.filename or "audio.webm", contents, file.content_type or "application/octet-stream")}
                resp = await client.post(base_url, headers=headers, data=data, files=files)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"STT provider request failed: {e}")

        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"STT provider error: {resp.status_code} {resp.text}")

        body = resp.json()
        return {"text": body.get("text", "")}

    # No API key -> try local Vosk fallback
    if not VOSK_AVAILABLE:
        raise HTTPException(status_code=501, detail=("No Groq/OpenAI key and local Vosk is not installed. "
                                                    "To enable transcription, add a GROQ_API_KEY to your .env file."))

    # write uploaded content to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=(os.path.splitext(file.filename)[1] if file.filename else ".webm")) as tmp_in:
        tmp_in.write(contents)
        tmp_in.flush()
        input_path = tmp_in.name

    wav_path = input_path + ".wav"
    ffmpeg_exe = _resolve_ffmpeg_executable()
    if not ffmpeg_exe:
        try:
            os.unlink(input_path)
        except Exception:
            pass
        raise HTTPException(
            status_code=500,
            detail=(
                "ffmpeg is not available. Install it, or install the Python package 'imageio-ffmpeg' "
                "and restart the backend."
            ),
        )

    # Convert to 16k mono wav using ffmpeg
    ffmpeg_cmd = [ffmpeg_exe, "-y", "-i", input_path, "-ar", "16000", "-ac", "1", "-f", "wav", wav_path]
    try:
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        try:
            os.unlink(input_path)
        except Exception:
            pass
        raise HTTPException(
            status_code=500,
            detail=(
                "ffmpeg conversion failed. If you installed 'imageio-ffmpeg', restart the backend; "
                "otherwise install ffmpeg or set FFMPEG_BINARY to its executable path."
            ),
        )

    # ensure model exists
    model_path = os.getenv("VOSK_MODEL_PATH", "models/vosk-model-small-en-us-0.15")
    if not os.path.exists(model_path):
        try:
            os.unlink(input_path)
            os.unlink(wav_path)
        except Exception:
            pass
        raise HTTPException(status_code=501, detail=(f"Vosk model not found at '{model_path}'. Download an English model (e.g. 'vosk-model-small-en-us-0.15') "
                                                    "and extract it to that path, or set VOSK_MODEL_PATH env var."))

    # Run Vosk recognizer on wav file
    try:
        wf = wave.open(wav_path, "rb")
    except Exception:
        try:
            os.unlink(input_path)
            os.unlink(wav_path)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="Converted audio not readable as WAV")

    try:
        model = Model(model_path)
        rec = KaldiRecognizer(model, wf.getframerate())
        rec.SetWords(True)
        results = []
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                r = json.loads(rec.Result())
                results.append(r.get("text", ""))
        final = json.loads(rec.FinalResult()).get("text", "")
        transcript = " ".join([t for t in results if t])
        if final:
            transcript = (transcript + " " + final).strip()
    finally:
        try:
            wf.close()
        except Exception:
            pass
        try:
            os.unlink(input_path)
            os.unlink(wav_path)
        except Exception:
            pass

    return {"text": transcript}
