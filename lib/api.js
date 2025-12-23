const BASE_URL = 'http://localhost:8000';

/**
 * Search regulations with query parameters
 * @param {Object} filters - { q, type, region, etc. }
 */
export async function searchRegulations(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const res = await fetch(`${BASE_URL}/regulations?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch regulations');
  return res.json();
}

/**
 * Get details for a specific list of IDs
 * @param {Array<string>} ids 
 */
export async function getBatchRegulations(ids) {
  if (!ids || ids.length === 0) return [];
  
  const res = await fetch(`${BASE_URL}/regulations/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) throw new Error('Failed to fetch batch regulations');
  return res.json();
}

/**
 * Export selected regulations to PDF
 * @param {Array<string>} ids 
 */
export async function exportSelection(ids) {
  if (!ids || ids.length === 0) return;

  try {
    const res = await fetch(`${BASE_URL}/export/pdf`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      // Fix 422: Wrap ids in "document_ids" to match Pydantic model
      body: JSON.stringify({ document_ids: ids }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erreur lors de l\'export PDF');
    }

    // Handle binary PDF download
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_veille_reglementaire_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
}
