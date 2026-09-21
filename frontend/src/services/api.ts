import {
  DashboardStats,
  Observation,
  ObservationCreateInput,
  PlantAnalysisResult,
  SamplePlant,
  KnowledgeDoc,
  CorridorAnalysisResponse,
  RAGSource
} from '../types';

const BASE_URL = '/api';

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
  return res.json();
}

export async function getObservations(params?: { status?: string; search?: string }): Promise<Observation[]> {
  const queryParams = new URLSearchParams();
  if (params?.status && params.status !== 'all') {
    queryParams.set('status', params.status);
  }
  if (params?.search) {
    queryParams.set('search', params.search);
  }
  const url = `${BASE_URL}/observations?${queryParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch observations');
  return res.json();
}

export async function createObservation(input: ObservationCreateInput): Promise<Observation> {
  const res = await fetch(`${BASE_URL}/observations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) throw new Error('Failed to record biodiversity observation');
  return res.json();
}

export async function deleteObservation(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/observations/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete observation');
  return res.json();
}

export async function analyzePlant(payload: {
  sample_id?: string;
  image_base64?: string;
  user_notes?: string;
  simulated_low_confidence?: boolean;
}): Promise<PlantAnalysisResult> {
  const res = await fetch(`${BASE_URL}/analyze-plant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Plant analysis failed');
  return res.json();
}

export async function getSamplePlants(): Promise<SamplePlant[]> {
  const res = await fetch(`${BASE_URL}/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample plants');
  return res.json();
}

export async function getKnowledgeDocs(): Promise<KnowledgeDoc[]> {
  const res = await fetch(`${BASE_URL}/knowledge`);
  if (!res.ok) throw new Error('Failed to fetch knowledge documents');
  return res.json();
}

export async function queryKnowledge(query: string, threshold: number = 0.40): Promise<{
  query: string;
  status: string;
  answer: string;
  sources: RAGSource[];
  expert_verification_required: boolean;
}> {
  const res = await fetch(`${BASE_URL}/knowledge/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, threshold })
  });
  if (!res.ok) throw new Error('Knowledge query failed');
  return res.json();
}

export async function getCorridors(): Promise<CorridorAnalysisResponse> {
  const res = await fetch(`${BASE_URL}/corridors`);
  if (!res.ok) throw new Error('Failed to fetch corridor analysis');
  return res.json();
}

export async function sendChatMessage(messages: { role: string; content: string }[], query: string): Promise<{
  reply: string;
  sources: RAGSource[];
  expert_verification_suggested: boolean;
  safe_management_flags: string[];
}> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, query })
  });
  if (!res.ok) throw new Error('Chat assistant request failed');
  return res.json();
}
