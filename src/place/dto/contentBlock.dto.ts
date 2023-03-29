import { ContentBlock, ContentBlockType } from 'src/graphql';
import { ContentBlockEntity } from 'src/place/entities/contentBlock.entity';
import {
  ContentBulletListBlock,
  ContentGalleryBlock,
  ContentKeyValueListBlock,
  ContentMapBlock,
  ContentRisksAndMitigationsBlock,
  ContentTabsBlock,
  ContentTimelineBlock,
  ContentTitleBodyBlock,
  ContentYoutubeBlock,
  ContentDownloadActionCardsBlock,
  ContentHighlightCardBlock,
} from 'src/types';

export class ContentBlockDto extends ContentBlock {
  static fromEntity(entity: ContentBlockEntity): ContentBlockDto {
    switch (entity.type) {
      case ContentBlockType.TitleAndBody:
        return {
          ...entity,
          data: new ContentTitleBodyBlock(entity.data),
        };
      case ContentBlockType.BulletList:
        return {
          ...entity,
          data: new ContentBulletListBlock(entity.data),
        };
      case ContentBlockType.Timeline:
        return {
          ...entity,
          data: new ContentTimelineBlock(entity.data),
        };
      case ContentBlockType.RisksAndMitigations:
        return {
          ...entity,
          data: new ContentRisksAndMitigationsBlock(entity.data),
        };
      case ContentBlockType.KeyValueList:
        return {
          ...entity,
          data: new ContentKeyValueListBlock(entity.data),
        };
      case ContentBlockType.Tabs:
        return {
          ...entity,
          data: new ContentTabsBlock(entity.data),
        };
      case ContentBlockType.Youtube:
        return {
          ...entity,
          data: new ContentYoutubeBlock(entity.data),
        };
      case ContentBlockType.Map:
        return {
          ...entity,
          data: new ContentMapBlock(entity.data),
        };
      case ContentBlockType.DownloadActionCards:
        return {
          ...entity,
          data: new ContentDownloadActionCardsBlock(entity.data),
        };
      case ContentBlockType.Gallery:
        return {
          ...entity,
          data: new ContentGalleryBlock(entity.data),
        };
      case ContentBlockType.HighlightCard:
        return {
          ...entity,
          data: new ContentHighlightCardBlock(entity.data),
        };
      default:
        return null;
    }
  }
}
