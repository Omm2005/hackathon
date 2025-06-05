ALTER TABLE "node" ADD COLUMN "query" varchar(256);--> statement-breakpoint
ALTER TABLE "node" ADD COLUMN "sumaary" text;--> statement-breakpoint
ALTER TABLE "node" ADD COLUMN "sources" json;--> statement-breakpoint
ALTER TABLE "node" ADD COLUMN "images" json;--> statement-breakpoint
ALTER TABLE "edge" DROP COLUMN "label";--> statement-breakpoint
ALTER TABLE "node" DROP COLUMN "data";