export function formatMarkdown(text: string, formatBold: boolean = false): string {
  // Replace markdown headings with HTML headings
  let formattedText = text
    // Replace headings (h1 to h6)
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // Replace *##* with h2
    .replace(/\*##\*\s+(.+)$/gm, '<h2>$1</h2>')
    // Convert newlines to <br> tags
    .replace(/\n/g, '<br>');
    
  if (formatBold) {
    // Format text between ** as bold
    formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }
  
  return formattedText;
}