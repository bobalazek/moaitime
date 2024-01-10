import DOMPurify from 'dompurify';

export const sanitizeText = (text: string) => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['br'],
    ALLOWED_ATTR: [],
  });
};

export const convertTextToHtml = (text: string) => {
  return text.trim().replace(/\n/g, '<br />');
};
