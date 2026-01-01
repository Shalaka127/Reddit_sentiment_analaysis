# Reddit Sentiment & Profile Analyzer

A full-stack sentiment analysis application that analyzes Reddit user activity and subreddit content to understand emotional trends.  
The project was initially developed as a basic sentiment analysis engine in Google Colab and later converted into a web application with an interactive interface.

---

## Web Application

Live Demo:  
https://reddit-sentiment-pro-4lrn.bolt.host/

---

## Project Overview

This project analyzes Reddit data to determine:
- Sentiment of a user’s comments and upvoted posts
- Sentiment trends within selected subreddits
- Overall emotional tone using polarity and subjectivity scores

The system helps in understanding user behavior and community sentiment using Natural Language Processing (NLP) techniques and visual analytics.

---

## Development Approach & Evolution

### Phase 1: Core Engine Development (Google Colab)
- The project began as a basic sentiment analysis engine built in Google Colab
- Focused on correctness, experimentation, and validation
- Implemented using:
  - Python
  - Reddit API (PRAW)
  - TextBlob for sentiment analysis
  - Pandas for data handling
- Responsibilities:
  - Fetch Reddit comments, upvoted posts, and subreddit posts
  - Compute sentiment polarity and subjectivity
  - Validate outputs using basic visualizations

This phase established a strong analytical foundation.

---

### Phase 2: GUI Integration
- A graphical interface was added to make the system interactive
- Users could authenticate, run analysis, and view results visually
- This converted the notebook logic into an application-like experience

---

### Phase 3: Web Application Conversion
- The final phase converted the project into a web-based application
- Frontend technologies:
  - HTML
  - Tailwind CSS
- Backend technology:
  - Node.js

This transformation made the project suitable for demonstrations and real-world use.

---

## Key Features

- Reddit OAuth authentication
- Automatic detection of authenticated user
- Sentiment analysis of:
  - User comments
  - Upvoted posts
  - Subreddit posts
- Sentiment distribution charts
- Average sentiment per subreddit
- Tabular data outputs
- Interactive GUI and web interface

---

## Technologies Used

| Technology | Purpose |
|----------|---------|
| Python | Core analysis and NLP |
| PRAW | Reddit API integration |
| TextBlob | Sentiment analysis |
| Pandas | Data processing |
| Matplotlib | Visualization |
| Seaborn | Statistical plots |
| HTML | Web structure |
| Tailwind CSS | Frontend styling |
| Node.js | Backend logic |
| Google Colab | Development and prototyping |

---

## Project Flow (How It Works)

### 1. User Authentication
- User authorizes Reddit access using OAuth
- Authorization code is verified securely using the Reddit API

### 2. Data Collection
- Fetches user comments
- Fetches user upvoted posts
- Fetches recent posts from a selected subreddit

### 3. Sentiment Analysis
- Each text item is analyzed using TextBlob
- The following scores are calculated:
  - Polarity (positive or negative sentiment)
  - Subjectivity (opinion-based intensity)

### 4. Visualization
- Sentiment distribution charts
- Average sentiment per subreddit
- Tabular data for detailed analysis

### 5. Presentation
- Results are displayed through:
  - An interactive GUI
  - A web-based application interface

---

## How to Run

### Google Colab
1. Open the notebook in Google Colab
2. Install the required dependencies (included in the notebook)
3. Add Reddit API credentials securely
4. Run all cells
5. Use the GUI to analyze sentiment

### Web Application
1. Start the Node.js backend
2. Open the frontend built with HTML and Tailwind CSS
3. Authenticate the Reddit account
4. Run sentiment analysis through the web interface

---

## Notes & Limitations

- OAuth redirect works best when run locally
- TextBlob is lexicon-based and may not detect sarcasm accurately
- Reddit API rate limits apply
- Intended for educational and analytical purposes only

---

## Team Members
**Sarthak Mokal**  
GitHub: https://github.com/team-member-username  
LinkedIn: https://www.linkedin.com/in/team-member-linkedin  

---

## Future Enhancements

- Integration of advanced NLP models (BERT / Transformers)
- Time-based sentiment trend analysis
- Export results to CSV or JSON
- Cloud deployment
- Multi-user analysis support

---

## License

This project is licensed under the MIT License.


