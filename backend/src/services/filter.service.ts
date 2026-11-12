export class FilterService {
  private static offensiveWords = new Set([
    'asshole',
    'bastard',
    'bitch',
    'bullshit',
    'crap',
    'cunt',
    'dick',
    'fuck',
    'fucker',
    'fucking',
    'motherfucker',
    'nigger',
    'piss',
    'pussy',
    'shit',
    'slut',
    'whore',
  ]);

  private static spamKeywords = [
    'casino',
    'viagra',
    'cialis',
    'free crypto',
    'airdrop',
    't.me/',
    'telegram.me',
    'whatsapp me',
    'invest now',
    'binary option',
    'buy followers',
    'seo ranking',
  ];

  /**
   * Checks if the text contains profanity or spam signals.
   * Returns { isClean: boolean, reason?: string }
   */
  static evaluateText(text: string): { isClean: boolean; reason?: string } {
    const lower = text.toLowerCase();

    // Check for spam keywords
    for (const kw of this.spamKeywords) {
      if (lower.includes(kw)) {
        return { isClean: false, reason: 'Spam keywords detected' };
      }
    }

    // Check for link spam (guestbook messages should be friendly text, not external links)
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
    const urlMatches = text.match(urlPattern);
    if (urlMatches && urlMatches.length > 1) {
      return { isClean: false, reason: 'Excessive URLs detected' };
    }

    // Check profanity against word boundaries
    const words = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    for (const w of words) {
      if (this.offensiveWords.has(w)) {
        return { isClean: false, reason: 'Inappropriate language detected' };
      }
    }

    return { isClean: true };
  }
}
