require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- EXPANDED MOCK DATABASE (Now includes specific email keys) ---
const BREACH_DATABASE = {
    // --- PERSONAS (Groups of breaches) ---
    "test@example.com": [
        { Name: "Adobe", Domain: "adobe.com", BreachDate: "2013-10-04", Description: "153 million accounts breached. Customer IDs, encrypted passwords, and plain text hints were stolen." },
        { Name: "LinkedIn", Domain: "linkedin.com", BreachDate: "2016-05-17", Description: "164 million email addresses and passwords were exposed." },
        { Name: "Canva", Domain: "canva.com", BreachDate: "2019-05-24", Description: "Usernames, names, email addresses, and country data were impacted." }
    ],
    
    // --- SPECIFIC DEMO EMAILS (Fixed) ---
    "adobe@test.com": [
        { Name: "Adobe", Domain: "adobe.com", BreachDate: "2013-10-04", Description: "153 million accounts breached. Customer IDs, encrypted passwords, and plain text hints were stolen." }
    ],
    "linkedin@test.com": [
        { Name: "LinkedIn", Domain: "linkedin.com", BreachDate: "2016-05-17", Description: "164 million email addresses and passwords were exposed." }
    ],
    "crypto@binance.com": [
        { Name: "Binance", Domain: "binance.com", BreachDate: "2019-05-07", Description: "API keys, 2FA codes, and 7,000 BTC were stolen." }
    ],
    "player@steam.com": [
        { Name: "Steam", Domain: "steampowered.com", BreachDate: "2011-11-01", Description: "User database compromised including hashed passwords and game purchase history." }
    ],
    "user@facebook.com": [
        { Name: "Facebook", Domain: "facebook.com", BreachDate: "2019-08-30", Description: "533 million users' phone numbers and account details leaked." }
    ],
    
    // --- FINANCIAL & CRYPTO ---
    "finance@target.com": [
        { Name: "Equifax", Domain: "equifax.com", BreachDate: "2017-09-07", Description: "143 million consumers affected. Social Security numbers and driver's license numbers stolen." },
        { Name: "Capital One", Domain: "capitalone.com", BreachDate: "2019-03-22", Description: "100 million credit card applications were accessed illegally." },
        { Name: "JP Morgan Chase", Domain: "jpmorganchase.com", BreachDate: "2014-06-01", Description: "Contact info for 76 million households compromised." }
    ],

    // --- GAMING ---
    "gamer@xyz.com": [
        { Name: "Sony PSN", Domain: "playstation.com", BreachDate: "2011-04-17", Description: "77 million accounts compromised. Full names, birthdays, and credit card data." },
        { Name: "Discord", Domain: "discord.com", BreachDate: "2023-01-01", Description: "Ticket support queue database was accessed." },
        { Name: "Zynga", Domain: "zynga.com", BreachDate: "2019-09-12", Description: "173 million accounts. Passwords, phone numbers, and Facebook IDs." }
    ],

    // --- SOCIAL MEDIA ---
    "social@influencer.com": [
        { Name: "Facebook", Domain: "facebook.com", BreachDate: "2019-08-30", Description: "533 million users' phone numbers and account details leaked." },
        { Name: "Twitter", Domain: "twitter.com", BreachDate: "2022-07-21", Description: "5.4 million accounts linked to phone numbers and emails exposed." },
        { Name: "Snapchat", Domain: "snapchat.com", BreachDate: "2013-12-31", Description: "4.6 million usernames and phone numbers published online." }
    ],

    // --- RETAIL ---
    "shopper@mall.com": [
        { Name: "Target", Domain: "target.com", BreachDate: "2013-12-18", Description: "40 million credit and debit card accounts stolen." },
        { Name: "Amazon", Domain: "amazon.com", BreachDate: "2020-10-05", Description: "Customer email addresses disclosed by employee." },
        { Name: "eBay", Domain: "ebay.com", BreachDate: "2014-05-21", Description: "Encrypted passwords and other non-financial data for 145 million users." },
        { Name: "Shein", Domain: "shein.com", BreachDate: "2018-08-22", Description: "6.42 million email addresses and encrypted passwords." },
        { Name: "Macy's", Domain: "macys.com", BreachDate: "2018-06-27", Description: "Online customer data skimming attack affecting payment information." }
    ],

    // --- GOV & HEALTH ---
    "gov@admin.net": [
        { Name: "OPM (US Gov)", Domain: "opm.gov", BreachDate: "2015-06-04", Description: "4 million federal employees' personnel files stolen." },
        { Name: "NHS", Domain: "nhs.uk", BreachDate: "2017-05-12", Description: "WannaCry ransomware attack affected patient records across 16 hospitals." }
    ],

    // --- DEV ---
    "dev@github.com": [
        { Name: "GitHub", Domain: "github.com", BreachDate: "2022-04-15", Description: "OAuth tokens stolen from private repositories." },
        { Name: "SolarWinds", Domain: "solarwinds.com", BreachDate: "2020-12-13", Description: "Supply chain attack compromising 18,000 organizations." }
    ],

    // --- TRAVEL ---
    "traveler@world.com": [
        { Name: "Marriott", Domain: "marriott.com", BreachDate: "2018-11-30", Description: "500 million guest records from Starwood reservation database." },
        { Name: "Uber", Domain: "uber.com", BreachDate: "2016-10-01", Description: "57 million driver and rider accounts compromised." }
    ],

    // --- TELECOM ---
    "phone@call.com": [
        { Name: "T-Mobile", Domain: "t-mobile.com", BreachDate: "2021-08-16", Description: "50 million customers' SSNs and IMEI numbers stolen." },
        { Name: "Verizon", Domain: "verizon.com", BreachDate: "2017-07-12", Description: "14 million customer records exposed on unsecured cloud server." }
    ],

    // --- DATING ---
    "single@heart.com": [
        { Name: "Ashley Madison", Domain: "ashleymadison.com", BreachDate: "2015-07-15", Description: "32 million user profiles published, causing significant real-world harm." },
        { Name: "Tinder", Domain: "tinder.com", BreachDate: "2020-01-20", Description: "70,000 photos of female users dumped on hacking forum." }
    ]
};

// 1. Search Endpoint
app.post('/api/search', async (req, res) => {
    const { email } = req.body;
    console.log(`Searching for: ${email}`);

    // Simulate database lookup
    const breaches = BREACH_DATABASE[email] || [];
    
    // If no breaches, return safe status
    if (breaches.length === 0) {
        return res.json({ status: "safe", breaches: [] });
    }

    return res.json({ status: "pwned", breaches: breaches });
});

// 2. AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
    const { email, breaches } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            You are a top-tier Cybersecurity Analyst for CyberGuard AI. 
            The user with email "${email}" has been involved in the following data breaches: ${JSON.stringify(breaches)}.
            
            Please provide a professional security report in strict JSON format with these specific fields:
            1. "riskLevel": (High, Medium, or Low)
            2. "summary": (A concise 1-2 sentence summary of the danger)
            3. "actions": (An array of 3 specific, actionable steps the user should take immediately based on these specific breaches).
            
            IMPORTANT: Do not use Markdown formatting. Return ONLY raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        res.json(JSON.parse(cleanText));
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI analysis failed" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));