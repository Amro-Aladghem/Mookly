import type { ActiveInterviewCache, GetMockInterviewDto } from '@/types/mockInterview';

export function buildMockInterviewInfoMessage(
  interview: GetMockInterviewDto | ActiveInterviewCache,
): string {
  const lines = [
    'مرحباً، أريد بدء مقابلة تدريبية.',
    `نوع المقابلة: ${interview.mockInterviewType}`,
    interview.jobType ? `نوع الوظيفة: ${interview.jobType}` : '',
    interview.jobLevel ? `المستوى الوظيفي: ${interview.jobLevel}` : '',
    `نبذة عن المقابلة: ${interview.about}`,
    'أرجو أن تبدأ المقابلة وتطرح عليّ الأسئلة.',
  ];

  return lines.filter((line) => line.trim().length > 0).join('\n');
}

export function makeActiveInterviewCache(
  interview: GetMockInterviewDto,
): ActiveInterviewCache {
  const infoMessage = buildMockInterviewInfoMessage(interview);

  return {
    mockInterviewId: interview.id ?? '',
    chatSignature: interview.chatSignture,
    infoMessage,
    mockInterviewType: interview.mockInterviewType,
    jobType: interview.jobType ?? null,
    jobLevel: interview.jobLevel ?? null,
    about: interview.about,
    createdAt: interview.createdAt,
  };
}
