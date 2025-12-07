export const FEATURES_GRID_CONTENT = {
    title: "AI-Powered Resume Screening Made Simple",
    features: [
        {
            title: "Smart Resume Parsing",
            description: "Upload resumes in any format and let AI extract skills, experience, and qualifications instantly.",
            gridClass: "col-span-2 row-span-1",
            image: "/features/parsing.png"
        },
         {
            title: "Advanced Analytics",
            description: "Gain insights into your hiring pipeline with comprehensive analytics and reporting.",
            gridClass: "col-span-1 row-span-1",
            image: "/features/analytics.png" // You can add analytics.png later
        },
        {
            title: "Powerful Integrations",
            description: "No-code integrations supercharge your flows and leverage setup you've already done in other tools.",
            gridClass: "col-span-2 row-span-1",
            integrations: [
                { name: "LinkedIn", logo: "/features/linkedin.png" },
                { name: "Indeed", logo: "/features/indeed.png" },
                { name: "Greenhouse", logo: "/features/greenhouse.png" },
                { name: "Workday", logo: "/features/glassdor.png" }
            ]
        },
        {
            title: "AI Matching Engine",
            description: "Let AI match candidates to job requirements in seconds with precision scoring.",
            gridClass: "col-span-1 row-span-1",
            image: "/features/ai-engine.png" // You can add ai-match.png later
        },
       
    ]
}
