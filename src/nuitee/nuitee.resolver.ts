import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from 'src/auth/auth.decorator';
import { User as UserType } from 'src/graphql';
import {
  ContentBulletListBlock,
  ContentRisksAndMitigationsBlock,
  ContentTimelineBlock,
  ContentKeyValueListBlock,
  ContentTabsBlock,
  ContentTitleBodyBlock,
  ContentYoutubeBlock,
  ContentMapBlock,
  ContentDownloadActionCardsBlock,
  ContentGalleryBlock,
  ContentHighlightCardBlock,
} from 'src/types';
import { NuiteeService } from './nuitee.service';

@Resolver('ContentBlockData')
export class ContentBlockDataResolver {
  private static supportedBlocks = [
    ContentTitleBodyBlock,
    ContentBulletListBlock,
    ContentTimelineBlock,
    ContentRisksAndMitigationsBlock,
    ContentKeyValueListBlock,
    ContentTabsBlock,
    ContentYoutubeBlock,
    ContentMapBlock,
    ContentDownloadActionCardsBlock,
    ContentGalleryBlock,
    ContentHighlightCardBlock,
  ];

  @ResolveField()
  __resolveType(value) {
    const supportedBlock = ContentBlockDataResolver.supportedBlocks.find(
      (block) => block.name === value.constructor.name,
    );
    if (!supportedBlock) {
      throw new Error(
        `content block ${value.constructor.name} did not match a type. Did you forget one?`,
      );
    }
    return supportedBlock.name;
  }
}

@Resolver('Nuitee')
export class NuiteeResolver {
  constructor(private nuiteeService: NuiteeService) {}
}
