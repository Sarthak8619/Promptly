import streamlit as st
from rag.enhancer import generate_enhanced_prompt

st.set_page_config(page_title="Promptly - Prompt Engineer", layout="centered")

st.title("🛠️ Promptly")
st.subheader("Transform your raw prompt into a structured, optimized LLM prompt using real prompt engineering guides.")

# Text area for raw prompt input
raw_prompt = st.text_area("💬 Enter your raw prompt here:", height=200)

# Button to trigger enhancement
if st.button("✨ Enhance Prompt"):
    if raw_prompt.strip() == "":
        st.warning("Please enter a prompt to enhance.")
    else:
        with st.spinner("Enhancing your prompt using Gemini and expert guides..."):
            enhanced_prompt = generate_enhanced_prompt(raw_prompt)
            st.success("Done! Here's your enhanced prompt:")

            # Output area
            st.text_area("✅ Enhanced Prompt", value=enhanced_prompt, height=250)

# Footer
st.markdown("---")
st.caption("Built with 💡 prompt engineering + 🧠 Gemini + 🔎 LangChain RAG")
