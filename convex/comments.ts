import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

// add new comment
export const addComment = mutation({
    args: {
        interviewId: v.id("interviews"),
        content: v.string(),
        rating: v.number(),
    },
    handler: async (ctx, args) => {

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User not authenticated");

        // const { content, rating, interviewId } = args;

        await ctx.db.insert("comments", {
            interviewId: args.interviewId,
            content: args.content,
            rating: args.rating.toString(),
            interviewerId: identity.subject,
        })

        // Add your logic to create a new comment
    }
});

// get all the comments for an interview

export const getComments = query({
    args: {
        interviewId: v.id("interviews"),
    },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_interview", q => q.eq("interviewId", args.interviewId))
            .collect();
        return comments;
    },
});