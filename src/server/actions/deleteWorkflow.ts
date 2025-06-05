'use server';

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { workflows, nodes, edges } from "@/server/db/schema";

export async function deleteWorkflow(workflowId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to delete a workflow"
      };
    }

    const userId = session.user.id;

    // First verify the workflow exists and belongs to the user
    const workflow = await db.query.workflows.findFirst({
      where: eq(workflows.id, workflowId),
    });

    if (!workflow) {
      return {
        success: false,
        message: "Workflow not found"
      };
    }

    if (workflow.userId !== userId) {
      return {
        success: false,
        message: "You don't have permission to delete this workflow"
      };
    }

    // Delete workflow and all related data in a transaction
    await db.transaction(async (tx) => {
      // Delete all edges first (due to foreign key constraints)
      await tx.delete(edges)
        .where(eq(edges.workflowId, workflowId));

      // Delete all nodes
      await tx.delete(nodes)
        .where(eq(nodes.workflowId, workflowId));

      // Finally delete the workflow
      await tx.delete(workflows)
        .where(eq(workflows.id, workflowId));
    });

    return {
      success: true,
      message: "Workflow deleted successfully"
    };

  } catch (error) {
    console.error("[deleteWorkflow] Error:", error);
    return {
      success: false,
      message: "Failed to delete workflow. Please try again later."
    };
  }
}
