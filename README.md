# PolicyNow Canada – Voices Across Canada

**Vancouver AI Hackathon Round 3: BC's AI Story**

## 🚀 Live Demo
[https://policynow.ca](https://policynow.ca)

## 👥 Team Members

**Hugh Behroozy** – Creative Industry Executive, Founder & Project Lead

Hugh Behroozy is a creative industry executive with over 15 years of experience spanning entertainment, technology, and emerging media. He has been directly involved in large-scale projects across gaming, VFX, hardware, and software, collaborating with world-class teams to deliver innovative, high-impact creative solutions. Today, he focuses on building platforms that bridge technology, storytelling, and public engagement.

## 📖 Project Overview

PolicyNow Canada is a civic engagement platform designed to capture, summarize, and map public opinion on artificial intelligence and other emerging technologies. Our mission is to provide policymakers, researchers, and the public with clear, accessible insight into the evolving sentiment landscape, enabling more informed, evidence-based decision-making.

During the BC-AI Hackathon, we collected a dataset of public perspectives from across British Columbia. Each submission is distilled into a concise "voice blurb" that preserves the meaning and tone while making it easy to read and compare. These voices are visualized on our interactive "Voices Across Canada" map, where users can explore sentiment by region and topic.

For visual clarity, location points are currently spread geographically to avoid overlap; however, our long-term goal is to gather more precise, riding-level location data (with consent) to deliver truly accurate constituency-based insights for policymakers. This expansion will allow for targeted analysis and direct integration into government consultation processes.

The next phase of PolicyNow will extend this approach nationwide, expand the dataset to cover other emerging tech topics, and introduce advanced analytics, filtering, and multilingual support. By combining intuitive design, robust data collection, and transparent reporting, we aim to empower both citizens and decision-makers in shaping BC's AI story and Canada's technological future.

## 🛠️ Technical Notes

The PolicyNow Canada prototype is built as a secure, modular web application with a React frontend using Vite and TypeScript, enhanced by ShadCN UI components and TailwindCSS for modern, responsive styling. The backend leverages Supabase for authentication and secure data storage, with sensitive configurations kept private in this public repository.

Our mapping functionality combines CARTO with OpenStreetMap to render sentiment points and clusters, providing an intuitive geographic visualization of public opinion. The data processing pipeline anonymizes hackathon survey responses, categorizes them by sentiment (positive, neutral, negative, unknown), and applies spatial adjustments for visual clarity on the map. Current geospatial adjustments scatter points slightly to avoid overlap while maintaining regional accuracy.

Security and privacy are paramount: sensitive backend logic, API keys, and raw datasets are excluded from the public repository, with only anonymized and aggregated data used for the demo version. The architecture supports modular dataset expansion through environment-driven configuration, enabling rapid adaptation for new regions and topics.

Planned scalability features include AI-assisted summarization for processing larger datasets, advanced filtering by topic and geography, real-time analytics dashboards for policymakers, and precision riding-level mapping. Future enhancements will support bilingual (English/French) and multilingual features to serve Canada's diverse population, making PolicyNow a truly national platform for democratic engagement.

## 📊 Data Sources
- **Primary Dataset**: BC AI Survey (1,001 responses from Vancouver AI Hackathon)
- **Geographic Data**: Statistics Canada boundary files
- **Sentiment Analysis**: Custom NLP processing of open-ended responses

## 🔮 Roadmap
- [ ] Expand dataset to all Canadian provinces and territories
- [ ] Integrate precise riding-level geolocation with consent
- [ ] Add AI-assisted response summarization
- [ ] Launch policymaker dashboard with trend analysis
- [ ] Support bilingual (English/French) and multilingual features
- [ ] Real-time public consultation integration

## 🔒 Privacy & Ethics
- All personal identifiers have been removed from the dataset
- Data is used strictly for research, policy, and public good purposes
- Follows Canadian privacy legislation and best practices
- Open source approach ensures transparency and accountability

## 📜 License
This project is open source and available under the [MIT License](LICENSE).

---

*PolicyNow Canada – Making democracy more responsive through data visualization*