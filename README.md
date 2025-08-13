# PolicyNow Canada

**Vancouver AI Hackathon 2025 Submission**

PolicyNow Canada is a public sentiment data visualization platform designed to bridge the gap between citizens and policymakers on AI and emerging technologies. Built using the BC AI Survey dataset from the Vancouver AI Hackathon.

## 🚀 Live Demo
[https://policynow.ca](https://policynow.ca)

## 📋 Features
- **Interactive Sentiment Map**: Visualize public opinion across British Columbia
- **Advanced Filtering**: Filter by sentiment category (positive, neutral, negative, unknown)
- **Real-time Analytics**: Summary statistics and demographic breakdowns
- **Contributor Recognition**: Highlight community voices and contributors
- **Open Data Access**: Public dataset transparency and accessibility

## 🗺️ About the Data
This project uses the BC AI Survey dataset containing 1,001 responses from British Columbians about artificial intelligence. The sentiment data has been spatially adjusted for visual clarity while maintaining statistical integrity. Future iterations will incorporate exact riding-level data for precise policymaker insights.

## 🛠️ Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Mapping**: CARTO + OpenStreetMap
- **Data Processing**: Custom sentiment analysis pipeline
- **Deployment**: Vercel

## 🎯 Hackathon Goals
- Bridge the communication gap between citizens and policymakers
- Make public sentiment data accessible and actionable
- Demonstrate how AI can enhance democratic participation
- Create a scalable model for public consultation visualization

## 🏗️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/policynow-canada.git
cd policynow-canada

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
```bash
# Required environment variables (see .env.example)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Data Sources
- **Primary Dataset**: BC AI Survey (1,001 responses)
- **Geographic Data**: Statistics Canada boundary files
- **Sentiment Analysis**: Custom NLP processing of open-ended responses

## 🔮 Roadmap
- [ ] Expand dataset to full Canada coverage
- [ ] Integrate riding-level precision mapping
- [ ] Add policy-maker targeted reports and dashboards
- [ ] Implement real-time public consultation features
- [ ] Enhanced accessibility and mobile optimization
- [ ] Multi-language support (French/English)

## 🤝 Contributing
We welcome contributions! This project was built for the Vancouver AI Hackathon to demonstrate how technology can enhance democratic participation.

## 🔒 Privacy & Ethics
- All personal identifiers have been removed from the dataset
- Data is used strictly for research, policy, and public good purposes
- Follows Canadian privacy legislation and best practices
- Open source approach ensures transparency and accountability

## 📜 License
This project is open source and available under the [MIT License](LICENSE).

## 🏆 Hackathon Team
Built for Vancouver AI Hackathon 2025 - demonstrating how AI can bridge the gap between public sentiment and policy-making.

## 📧 Contact
For questions about this project or collaboration opportunities, please open an issue on GitHub.

---

*PolicyNow Canada - Making democracy more responsive through data visualization*