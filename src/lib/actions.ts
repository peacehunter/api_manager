'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { analyzeSalesTrends } from '@/ai/flows/analyze-sales-trends';
//import { getSales } from './data';

// This file is now primarily for actions that don't fit into the REST API, like AI analysis.

export async function revalidateDashboard() {
    revalidatePath('/');
    revalidatePath('/reports');
}

// export async function generateTrendsAnalysisAction() {
//     try {
//         const sales = await getSales();
//         const salesDataString = sales
//             .map(sale => `${sale.itemName}:${sale.quantity}`)
//             .join(', ');

//         if (!salesDataString) {
//             return {
//                 trendsAnalysis: "Not enough sales data to perform analysis.",
//                 suggestedActions: "Record more sales to enable this feature."
//             }
//         }
        
//         const analysis = await analyzeSalesTrends({ salesData: salesDataString });
//         return analysis;

//     } catch (error) {
//         console.error("Error generating trends analysis:", error);
//         return {
//             error: "Failed to generate AI analysis. Please try again later."
//         };
//     }
// }
