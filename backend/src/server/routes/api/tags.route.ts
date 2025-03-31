import { db } from "@/db";
import { tags as tagsTable } from "@/db/schema";
import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/tags", async (req: Request, res: Response) => {
    try {
        // Query the tags table to select all tag records
        const tags = await db.select().from(tagsTable);

        // Send the fetched tags as a JSON response
        res.json(tags);
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({ error: "Failed to fetch tags" });
    }
});

export default router;