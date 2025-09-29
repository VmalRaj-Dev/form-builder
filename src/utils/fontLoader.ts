import { CustomFont } from '@/types/form';

// Keep track of loaded fonts to avoid duplicates
const loadedFonts = new Set<string>();

/**
 * Load a custom font from a URL (Google Fonts, Adobe Fonts, etc.)
 */
export function loadCustomFont(font: CustomFont): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if font is already loaded
    if (loadedFonts.has(font.url)) {
      resolve();
      return;
    }

    // Create link element for the font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = font.url;
    
    // Handle load success
    link.onload = () => {
      loadedFonts.add(font.url);
      console.log(`Font loaded successfully: ${font.name}`);
      resolve();
    };
    
    // Handle load error
    link.onerror = () => {
      console.error(`Failed to load font: ${font.name} from ${font.url}`);
      reject(new Error(`Failed to load font: ${font.name}`));
    };
    
    // Add to document head
    document.head.appendChild(link);
  });
}

/**
 * Load multiple custom fonts
 */
export async function loadCustomFonts(fonts: CustomFont[]): Promise<void> {
  try {
    await Promise.all(fonts.map(font => loadCustomFont(font)));
  } catch (error) {
    console.error('Error loading custom fonts:', error);
  }
}

/**
 * Extract font family name from Google Fonts URL
 * Example: https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap
 * Returns: 'Roboto'
 */
export function extractFontFamilyFromGoogleFontsUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const familyParam = urlObj.searchParams.get('family');
    if (familyParam) {
      // Extract font name before any colon (weight specifications)
      const fontName = familyParam.split(':')[0];
      // Replace + with spaces and decode URI components
      return decodeURIComponent(fontName.replace(/\+/g, ' '));
    }
  } catch (error) {
    console.error('Error parsing Google Fonts URL:', error);
  }
  return '';
}

/**
 * Generate a unique ID for a font
 */
export function generateFontId(name: string): string {
  return `font-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
}

/**
 * Validate if a URL looks like a valid font URL
 */
export function isValidFontUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Check for common font providers
    const validDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'use.typekit.net',
      'use.fontawesome.com',
      'cdn.jsdelivr.net',
      'unpkg.com'
    ];
    
    const isValidDomain = validDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
    
    // Also check for CSS file extensions
    const isValidExtension = url.includes('.css') || url.includes('family=');
    
    return isValidDomain || isValidExtension;
  } catch {
    return false;
  }
}

/**
 * Remove a loaded font from the document
 */
export function removeCustomFont(fontUrl: string): void {
  const links = document.querySelectorAll(`link[href="${fontUrl}"]`);
  links.forEach(link => link.remove());
  loadedFonts.delete(fontUrl);
}
