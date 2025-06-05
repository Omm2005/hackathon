'use server';

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { workflows } from "@/server/db/schema";

/**
 * Lightweight workflow information for sidebar display
 */
export type SidebarWorkflow = {
  id: string;
  name: string | null;
  updatedAt: Date | null;
};

/**
 * Fetches minimal workflow information for sidebar display
 * Only retrieves necessary fields (id and name) to optimize performance
 * 
 * @returns Array of workflow objects with id and name
 */
export async function getWorkflowsForSidebar(): Promise<{ 
  success: boolean; 
  workflows: SidebarWorkflow[];
  message?: string;
}> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        workflows: [],
        message: "Not authenticated"
      };
    }
    
    const userId = session.user.id;

    // Get only id and name fields for all user's workflows
    const userWorkflows = await db.query.workflows.findMany({
      where: eq(workflows.userId, userId),
      columns: {
        id: true,
        name: true,
        updatedAt: true, // Include updatedAt for sorting
      },
      orderBy: (workflows, { desc }) => [desc(workflows.updatedAt)],
    });

    return {
      success: true,
      workflows: userWorkflows
    };
  } catch (error) {
    console.error("Error fetching sidebar workflows:", error);
    return {
      success: false,
      message: "Failed to load workflows",
      workflows: []
    };
  }
}

