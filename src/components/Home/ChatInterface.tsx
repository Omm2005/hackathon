"use client";

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2, Atom, Brain, TreePine, Telescope } from 'lucide-react';
import { GlowingEffect } from '../ui/glowing-text';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import createProject from '@/server/actions/createWorkflow';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Define topic buttons in a separate array with colored icons
const topicButtons = [
  { 
    name: "Quantum Computing", 
    icon: <Atom className="h-4 w-4 mr-2" style={{ color: "#3b82f6" }} />
  },
  { 
    name: "Machine Learning", 
    icon: <Brain className="h-4 w-4 mr-2" style={{ color: "#8b5cf6" }} />
  },
  { 
    name: "Climate Science", 
    icon: <TreePine className="h-4 w-4 mr-2" style={{ color: "#22c55e" }} />
  }
];

const FormSchema = z.object({
  query: z.string().max(100, {
    message: "Search query must be less than 100 characters.",
  }),
})

type Props = {}

const ChatInterface = (props: Props) => {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "",
    },
  })

  const onSubmit = async(data: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);

      const response = await createProject({ query: data.query });

      if (response.success && response.workflow) {
        form.reset();
        toast.success(`Workflow "${response.workflow.name}" created successfully!`, {
          duration: 3000,
          description: "You can now start building your mindmap.",
        });
        
        // Navigate to the workflow page
        router.push(`/workflow/${response.workflow.id}?query=${encodeURIComponent(data.query)}`);
      } else {
        toast.error(`Error creating workflow: ${response.message}`, {
          duration: 3000,
          description: "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("An error occurred while creating the workflow. Please try again later.", {
        duration: 3000,
        description: "If the problem persists, contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const query = form.getValues('query');
      if (query && !isLoading) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <section className="flex flex-col h-auto gap-5 w-full px-5">
      {/* Greeting Section */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="md:text-4xl text-3xl text-center selection:bg-foreground selection:text-background">
          What do you want to explore?
        </h1>
      </div>

      {/* Input Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative mx-auto md:w-1/3 w-full">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <div className="flex flex-col bg-background rounded-lg border p-4 relative w-full">
                    <GlowingEffect
                      blur={1}
                      borderWidth={2}
                      spread={80}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                    />
                    <input
                      placeholder="Start your mindmap journey..."
                      className="w-full bg-background rounded-md outline-0 selection:bg-foreground selection:text-background"
                      {...field}
                      onKeyDown={handleKeyPress}
                      autoComplete="off"
                      disabled={isLoading}
                      autoFocus
                    />
                    
                    <div className="flex justify-between mt-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="rounded-full px-4 cursor-pointer pointer-events-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                          >
                            <Telescope />
                            Extreme
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                          <p>Extreme mode is currently disabled.</p>
                          <p className='text-foreground'>We are working on it.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        ref={buttonRef}
                        type="submit"
                        disabled={isLoading || form.getValues('query').length === 0}
                        size="sm"
                        className="rounded-full px-4 cursor-pointer"
                      >
                        {isLoading ? (
                          <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</>
                        ) : (
                          <><span className="mr-1">Create</span> <ArrowRight className="h-3 w-3" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="mt-2" />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Example Topics Section */}
      <div className='flex flex-wrap gap-2 mx-auto md:w-1/2 w-full mt-4 justify-center'>
        {topicButtons.map((topic) => (
          <Button
            key={topic.name}
            variant="outline"
            size="sm"
            className="rounded-full text-sm hover:bg-secondary flex items-center cursor-pointer hover:scale-105"
            onClick={() => {
              form.setValue("query", topic.name);
              form.handleSubmit(onSubmit)();
            }}
          >
            {topic.icon}
            {topic.name}
          </Button>
        ))}
      </div>
    </section>
  );
}

export default ChatInterface;