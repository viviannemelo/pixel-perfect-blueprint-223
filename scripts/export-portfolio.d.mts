export interface PortfolioAsset {
  url: string;
  original_filename: string;
}
export function localizeMedia(source: string, assets: PortfolioAsset[]): string;
export function exportPortfolio(destination: string): Promise<void>;