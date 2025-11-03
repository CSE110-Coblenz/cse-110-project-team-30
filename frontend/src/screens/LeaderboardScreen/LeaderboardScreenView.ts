// --- FRONTEND LOGIC (VIEW COMPONENT) ---
// This is the TypeScript code demonstrating type safety for fetching the data.
// It would need to be transpiled to JavaScript before running in a browser.

// Define the shape of a Leaderboard entry for strong typing
interface LeaderboardEntry {
    username: string;
    points: number;
}

const API_URL: string = 'http://localhost:3000/api/leaderboard';

/**
 * Fetches the leaderboard data from the Node.js API.
 */
async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: { success: boolean, data: LeaderboardEntry[] } = await response.json();

        if (result.success && Array.isArray(result.data)) {
            // TypeScript ensures the data matches the LeaderboardEntry interface
            return result.data;
        }

        throw new Error('API response format was invalid.');

    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        return []; // Return an empty array on failure
    }
}

/**
 * Renders the data into the HTML table (View update).
 * @param data - The array of leaderboard entries to render.
 */
function renderLeaderboard(data: LeaderboardEntry[]): void {
    const tableBody = document.getElementById('leaderboard-body') as HTMLTableSectionElement | null;
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Clear existing content

    data.forEach((entry, index) => {
        const row = tableBody.insertRow();
        row.className = 'hover:bg-gray-50 transition duration-150 ease-in-out';
        
        // Highlight top 3
        if (index === 0) row.className += ' bg-yellow-50 font-extrabold';
        else if (index === 1) row.className += ' bg-gray-100 font-bold';
        else if (index === 2) row.className += ' bg-amber-50 font-medium';

        // Rank
        let cell = row.insertCell();
        cell.textContent = (index + 1).toString();
        cell.className = 'text-center text-lg';

        // Username
        cell = row.insertCell();
        cell.textContent = entry.username;
        cell.className = 'text-left text-base';

        // Points
        cell = row.insertCell();
        cell.textContent = entry.points.toLocaleString();
        cell.className = 'font-semibold text-right text-base';
    });
}

/**
 * Main application initializer.
 */
async function initLeaderboard(): Promise<void> {
    const data = await fetchLeaderboard();
    renderLeaderboard(data);
}

// Execute the main function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initLeaderboard);