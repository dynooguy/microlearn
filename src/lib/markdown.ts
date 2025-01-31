export function formatMarkdown(text: string): string {
  // Replace markdown headings with HTML headings
  return text
    // Replace headings (h1 to h6)
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // Replace *##* with h2
    .replace(/\*##\*\s+(.+)$/gm, '<h2>$1</h2>')
    // Add more markdown formatting as needed
    .replace(/\n/g, '<br>'); // Convert newlines to <br> tags
}