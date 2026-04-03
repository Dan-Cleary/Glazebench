export function logoUrl(model: string): string {
  const provider = model.split('/')[0];

  const logos: Record<string, string> = {
    anthropic: 'https://openrouter.ai/logos/anthropic.svg',
    openai: 'https://openrouter.ai/logos/openai.svg',
    google: 'https://openrouter.ai/logos/google.svg',
    'x-ai': 'https://openrouter.ai/logos/x-ai.svg',
    meta: 'https://openrouter.ai/logos/meta.svg',
  };

  return logos[provider] || '';
}
