export const getDailyNewsletter = () => {
    const news = [
        "Market hits all-time high as tech stocks rally.",
        "Crypto regulation talks heat up in global summit.",
        "Inflation rates show signs of cooling down.",
        "New green energy incentives announced for investors.",
        "Major merger announced in the banking sector."
    ];

    // Randomly select a headline
    const randomNews = news[Math.floor(Math.random() * news.length)];

    return {
        title: "Daily Finance Digest 📈",
        body: `Today's Highlight: ${randomNews} Check your dashboard for more insights!`
    };
};
