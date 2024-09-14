import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/phase-change-diagram', (req: Request, res: Response) => {
    const pressure = parseFloat(req.query.pressure as string);

    if (isNaN(pressure)) {
        return res.status(400).json({ error: 'Value must be a number' });
    }

    const result = calculateCriticalVolume(pressure);

    if (!isNaN(result)) {
        return res.json({
            specific_volume_liquid: result,
            specific_volume_vapor: result
        });
    } else {
        return res.status(404).json({ error: 'Data not found for the specified pressure' });
    }
});

function calculateCriticalVolume(Pc2: number): number {
    if (Pc2 === 0) {
        throw new Error("New critical pressure (Pc2) cannot be zero.");
    }

    const Vc2 = (0.0035 * 10) / Pc2;
    return Vc2;
}

function truncateToFourDecimals(num: number): number {
    // Convert the number to a string with a high precision
    const numStr = num.toPrecision(15); // Ensures enough precision
    
    // Find the decimal point position
    const decimalIndex = numStr.indexOf('.');
  
    // If there is no decimal point, return the number as is
    if (decimalIndex === -1) return num;
  
    // Slice the string to keep only 4 decimal places
    const truncatedStr = numStr.slice(0, decimalIndex + 5); // +5 to include 4 decimals and the point
    
    // Convert back to number
    return parseFloat(truncatedStr);
  }

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

