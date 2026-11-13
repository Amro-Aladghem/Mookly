import type { CanvaDto } from '@/types/canva';

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function pick(source: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (key in source && source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }
  return null;
}

/**
 * Agent messages store the response payload inside ChatDto.data as a JSON string.
 * The payload can be wrapped (`{ "canva": {...} }`) or, in some tool messages,
 * prefixed with text before the JSON object. This parser tolerates both.
 */
export function parseCanvaFromChatData(data?: string | null): CanvaDto | null {
  if (!data) return null;

  const trimmed = data.trim();
  const jsonStart = trimmed.indexOf('{');
  const jsonEnd = trimmed.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd <= jsonStart) return null;

  try {
    const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;

    const root = parsed as Record<string, unknown>;
    const raw = pick(root, 'canva', 'Canva') ?? root;

    if (!raw || typeof raw !== 'object') return null;

    const canva = raw as Record<string, unknown>;
    const content = asString(pick(canva, 'content', 'Content'));
    if (!content) return null;

    return {
      id: asString(pick(canva, 'id', 'Id')),
      userId: asString(pick(canva, 'userId', 'UserId')) ?? '',
      chatSignture:
        asString(
          pick(canva, 'chatSignture', 'ChatSignture', 'chatSignature', 'ChatSignature'),
        ) ?? '',
      content,
      isSolved: Boolean(pick(canva, 'isSolved', 'IsSolved')),
      userAnswer: asString(pick(canva, 'userAnswer', 'UserAnswer')),
      canvaType: asString(pick(canva, 'canvaType', 'CanvaType')) ?? 'Markdown',
    };
  } catch {
    return null;
  }
}

export function resolveCanvaType(canva: CanvaDto | null): 'markdown' | 'html' | 'text' {
  const value = canva?.canvaType?.trim().toLowerCase();
  if (value === 'html') return 'html';
  if (value === 'markdown' || value === 'md') return 'markdown';
  return 'text';
}
