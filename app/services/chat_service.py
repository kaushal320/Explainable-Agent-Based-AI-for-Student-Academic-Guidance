import os
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
# from langchain_mongodb import MongoDBChatMessageHistory # To be added when Atlas is configured
from ..core.config import settings
from ..models.chat import ChatRequest, ChatResponse, ChatMessage
from .rag_service import rag_service
import logging

logger = logging.getLogger(__name__)

class ChatService:
    @staticmethod
    def _get_llm(streaming=False):
        if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your_api_key_here":
            raise ValueError("Groq API Key missing")
        return ChatGroq(
            temperature=0.7,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=settings.GROQ_API_KEY,
            streaming=streaming,
            max_tokens=1024
        )
        
    @staticmethod
    def _build_history(history):
        messages = []
        for msg in history[-10:]:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            else:
                messages.append(AIMessage(content=msg.content))
        return messages

    @staticmethod
    def get_response(request: ChatRequest) -> str:
        try:
            llm = ChatService._get_llm(streaming=False)
            
            system_prompt = f"""
            You are an elite AI Career Tutor and Teacher.
            Your goal is to help the student achieve their goal of becoming a {{career}}.
            
            Student Context:
            - Career Path: {{career}}
            - Current Weakness: {{top_weakness}}
            - Current GPA: {{gpa}}
            
            Context from Course/Syllabus (if any):
            {{context}}
            
            Guidelines:
            1. Be encouraging, professional, and highly educational.
            2. Use Markdown for formatting (bold, code blocks, bullet points).
            3. Answer their questions clearly based on the provided context if applicable.
            """
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ])
            
            question_answer_chain = create_stuff_documents_chain(llm, prompt)
            
            # Using RAG! We fetch documents using the Vector Store!
            # If the user doesn't have MongoDB configured yet, this will fallback gracefully.
            try:
                retriever = rag_service.vector_store.as_retriever(search_kwargs={"k": 3})
                rag_chain = create_retrieval_chain(retriever, question_answer_chain)
                
                logger.info("Executing RAG chain...")
                result = rag_chain.invoke({
                    "input": request.prompt,
                    "chat_history": ChatService._build_history(request.history),
                    "career": request.context.get('career', 'Professional IT Specialist'),
                    "top_weakness": request.context.get('top_weakness', 'General Studies'),
                    "gpa": request.context.get('skills', {}).get('GPA', 'N/A')
                })
                return result["answer"]
            except Exception as vector_e:
                logger.warning(f"Vector search failed (likely not configured), falling back to normal LLM: {vector_e}")
                # Fallback to direct reasoning without tools if Database isn't setup
                messages = [SystemMessage(content=prompt.format_messages(
                    input=request.prompt, chat_history=[], context=[], 
                    career=request.context.get('career'), 
                    top_weakness=request.context.get('top_weakness'), 
                    gpa=request.context.get('skills', {}).get('GPA')
                )[0].content)] + ChatService._build_history(request.history) + [HumanMessage(content=request.prompt)]
                
                response = llm.invoke(messages)
                return response.content
                
        except Exception as e:
            logger.error(f"Error calling Groq API: {e}")
            return f"❌ **Error:** {str(e)}"

    @staticmethod
    def get_streaming_response(request: ChatRequest):
        try:
            llm = ChatService._get_llm(streaming=True)
            # Simplified streaming without RAG for immediate UI feedback.
            # In a full advanced implementation, LangChain supports async streaming with Retrievers.
            
            system_prompt = f"""
            You are an elite AI Career Tutor and Teacher.
            Your goal is to help the student achieve their goal of becoming a {request.context.get('career', 'Professional IT Specialist')}.
            
            Guidelines:
            1. Be encouraging, professional, and highly educational.
            2. Use Markdown for formatting (bold, code blocks, bullet points).
            """
            
            messages = [SystemMessage(content=system_prompt)] + ChatService._build_history(request.history) + [HumanMessage(content=request.prompt)]
            
            for chunk in llm.stream(messages):
                if chunk.content:
                    yield chunk.content
                    
        except Exception as e:
            logger.error(f"Error calling Groq API for streaming: {e}")
            yield f"❌ **Error:** {str(e)}"
