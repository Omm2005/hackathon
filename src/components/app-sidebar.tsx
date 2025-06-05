"use client";

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { NavUser } from "./ui/nav-user"
import { format } from "date-fns"
import { Input } from "./ui/input"
import { Search, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { deleteWorkflow } from "@/server/actions/deleteWorkflow"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Workflow {
	id: string;
	name: string | null;
	updatedAt: Date | null;
}

interface AppSidebarProps {
	initialWorkflows: Workflow[];
	user: {
		avatar: string;
		email: string;
		name: string;
	};
}

export function AppSidebar({ initialWorkflows, user }: AppSidebarProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [workflows, setWorkflows] = useState(initialWorkflows);
	const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const filteredWorkflows = useMemo(() => {
		if (!searchQuery.trim()) return workflows;
		
		const query = searchQuery.toLowerCase();
		return workflows.filter(workflow => 
			workflow.name?.toLowerCase().includes(query) ||
			workflow.id.toLowerCase().includes(query)
		);
	}, [workflows, searchQuery]);

	const handleDelete = async (workflowId: string) => {
		try {
			setIsDeleting(true);
			const result = await deleteWorkflow(workflowId);
			
			if (result.success) {
				setWorkflows(prev => prev.filter(w => w.id !== workflowId));
				toast.success("Workflow deleted successfully");
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			toast.error("Failed to delete workflow");
			console.error("Delete error:", error);
		} finally {
			setIsDeleting(false);
			setWorkflowToDelete(null);
		}
	};

	return (
		<>
			<Sidebar variant="floating">
				<SidebarHeader>
					<div className="w-full h-auto flex flex-row justify-between items-center pl-3">
						<h3 className="text-center font-semibold text-xl">History</h3>
						<SidebarTrigger user={true} />
					</div>
				</SidebarHeader>
				<SidebarContent>
					{/* Search Bar */}
					<div className="px-4 py-2">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search history..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-9 pr-4 py-2 bg-muted/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
							/>
						</div>
					</div>

					{/* History Items */}
					<div className="mt-2 px-2">
						{filteredWorkflows.length > 0 ? (
							filteredWorkflows.map((item, index) => (
								<div key={index} className="mb-4 group relative">
									<Link href={`/workflow/${item.id}`}>
										<div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
											<h3 className="font-medium text-start">{item.name || item.id}</h3>
											<p className="text-xs text-start text-muted-foreground mt-2">
												Last updated {item.updatedAt ? format(item.updatedAt, "MMM d 'at' h:mm a") : "N/A"}
											</p>
										</div>
									</Link>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                            onClick={() => setWorkflowToDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Delete workflow</p>
                        </TooltipContent>
                    </Tooltip>
								</div>
							))
						) : (
							<div className="px-3 py-2 text-sm text-muted-foreground">
								{searchQuery ? "No matching workflows found" : "No workflows yet. Create your first one!"}
							</div>
						)}
					</div>
				</SidebarContent>
				<SidebarFooter>
					<NavUser user={user} />
				</SidebarFooter>
			</Sidebar>

			<AlertDialog open={!!workflowToDelete} onOpenChange={() => setWorkflowToDelete(null)}>
				<AlertDialogContent >
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the workflow
							and all its associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting} className="cursor-pointer" >Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => workflowToDelete && handleDelete(workflowToDelete)}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}