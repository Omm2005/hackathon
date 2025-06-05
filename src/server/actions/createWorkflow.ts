"use server";

import { db } from "@/server/db";
import { workflows, nodes } from "@/server/db/schema";
import { auth } from "@/server/auth";

export default async function createProject({ query }: { query: string }) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return { 
        success: false, 
        message: "You must be logged in to create a project" 
      };
    }
    
    const userId = session.user.id;
  
    // Create workflow and initial node in a transaction
    const result = await db.transaction(async (tx) => {
      // Insert the workflow
      const [workflow] = await tx.insert(workflows)
        .values({
          name: query,
          userId: userId,
          description: `Workflow for: ${query}`,
        })
        .returning();
      
      if (!workflow) {
        throw new Error("Failed to create workflow");
      }

      // Create initial node
      const [initialNode] = await tx.insert(nodes)
        .values({
            

          workflowId: workflow.id,
          name: "Initial Query",
          type: "default",
          position: { x: 0, y: 0 },
            query: query,
        })
        .returning();

      if (!initialNode) {
        throw new Error("Failed to create initial node");
      }

      return { workflow, initialNode };
    });
    
    return {
      success: true,
      workflow: result.workflow,
      initialNode: result.initialNode
    };
    
  } catch (error) {
    console.error("[createProject] Error creating workflow:", error);
    return {
      success: false,
      message: "Failed to create workflow. Please try again later."
    };
  }
}