def build_prompt(doc_type, text):
    base = """
You are ClauseLens AI.

Analyze the document and return STRICTLY in this format:

Summary:
<simple explanation>

Risks:
- <risk 1>
- <risk 2>

Important Clauses:
- "<clause>" → <explanation>
"""

    if doc_type == "rental":
        extra = "Focus on rent, eviction, deposits, penalties."
    elif doc_type == "insurance":
        extra = "Focus on coverage, exclusions, claims, hidden conditions."
    elif doc_type == "terms":
        extra = "Focus on user rights, data usage, liabilities."
    else:
        extra = """
If it's study material:
- Explain concepts simply
- Summarize key points

Otherwise:
- Explain normally
"""

    return f"{base}\n{extra}\n\nDocument:\n{text}"