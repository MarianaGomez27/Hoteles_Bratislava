/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderStatus {
  OPEN = 'OPEN',
  AGREED = 'AGREED',
  FULFILLED = 'FULFILLED',
  SYNCHRONISED = 'SYNCHRONISED',
  ISSUED = 'ISSUED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum Currency {
  USD = 'USD',
}

export enum SubscriptionAgreementStatus {
  NOT_SIGNED = 'NOT_SIGNED',
  SIGNED = 'SIGNED',
}

export enum ContentBlockType {
  TitleAndBody = 'TitleAndBody',
  BulletList = 'BulletList',
  Timeline = 'Timeline',
  RisksAndMitigations = 'RisksAndMitigations',
  KeyValueList = 'KeyValueList',
  Tabs = 'Tabs',
  Youtube = 'Youtube',
  Map = 'Map',
  DownloadActionCards = 'DownloadActionCards',
  Gallery = 'Gallery',
  HighlightCard = 'HighlightCard',
}

export enum PlaceType {
  HOTEL = 'HOTEL',
  AIRBNB = 'AIRBNB',
  TIMESHARE = 'TIMESHARE',
}

export class CreateOrderInput {
  type: OrderType;
  amount: number;
  quantity: number;
}

export class OrderInput {
  id?: Nullable<string>;
}

export class AllOrdersFilters {
  status?: Nullable<OrderStatus>;
}

export class AllOrdersInput {
  filters: AllOrdersFilters;
}

export class SubscriptionAgreementInput {
  orderId: string;
}

export class UpdateOrderInput {
  id: string;
  quantity: number;
}

export class CancelOrderInput {
  id: string;
}

export class OrderQuery {
  status?: Nullable<OrderStatus[]>;
}

export abstract class IMutation {
  abstract createUser(args?: Nullable<string>): boolean | Promise<boolean>;

  abstract createOrder(
    args: CreateOrderInput,
  ): CreateOrderPayload | Promise<CreateOrderPayload>;

  abstract updateOrder(
    args: UpdateOrderInput,
  ): UpdateOrderOutput | Promise<UpdateOrderOutput>;

  abstract cancelOrder(
    args: CancelOrderInput,
  ): CancelOrderOutput | Promise<CancelOrderOutput>;

  abstract updateUser(args?: Nullable<string>): User | Promise<User>;
}

export class Booking {
  id: string;
}

export class BankDetails {
  name: string;
  address: string;
  beneficiary: string;
  accountNumber: string;
  routingNumber: string;
  swift: string;
  paymentReference: string;
}

export class CreateOrderPayload {
  id: string;
}

export class Order {
  id: string;
  type: OrderType;
  amount: number;
  quantity: number;
  status: OrderStatus;
  bankDetails: BankDetails;
  transferConfirmed?: Nullable<boolean>;
  createdAt: string;
  updatedAt: string;
  user?: Nullable<UserBasic>;
}

export class SubscriptionAgreement {
  id: string;
  userId: string;
  orderId: string;
  envelopeId?: Nullable<string>;
  status: SubscriptionAgreementStatus;
}

export class SubscriptionAgreementData {
  agreement?: Nullable<SubscriptionAgreement>;
  subscriptionAgreementUrl: string;
}

export class UpdateOrderOutput {
  id: string;
  quantity: number;
  amount: number;
}

export class CancelOrderOutput {
  id: string;
  status: OrderStatus;
}

export abstract class IQuery {
  abstract order(args: OrderInput): Order | Promise<Order>;

  abstract orders(args: OrderQuery): Order[] | Promise<Order[]>;

  abstract allOrders(args: AllOrdersInput): Order[] | Promise<Order[]>;

  abstract getOrdersByUserId(
    userId: string,
  ): Nullable<Order>[] | Promise<Nullable<Order>[]>;

  abstract user(): Nullable<User> | Promise<Nullable<User>>;
}

export class Image {
  src: string;
  alt: string;
}

export class ContentBlock {
  type: ContentBlockType;
  data: ContentBlockData;
}

export class ContentYoutubeBlock {
  title: string;
  url: string;
}

export class ContentMapBlock {
  imageUrl: string;
  mapUrl: string;
}

export class ContentGalleryBlock {
  urls: string[];
}

export class ContentTitleBodyBlock {
  title: string;
  description: string;
}

export class ContentBulletListBlock {
  items: ContentBulletListBlockItem[];
}

export class ContentBulletListBlockItem {
  icon: string;
  title: string;
  description: string;
}

export class ContentTimelineBlock {
  title: string;
  description: string;
  items: ContentTimelineBlockItem[];
}

export class ContentTimelineBlockItem {
  icon: string;
  year: number;
  content: string;
}

export class ContentRisksAndMitigationsBlock {
  title: string;
  description: string;
  items: ContentRisksAndMitigationsBlockItem[];
}

export class ContentRisksAndMitigationsBlockItem {
  risk: string;
  mitigation: string;
  mitigationDetails: string;
}

export class ContentKeyValueListBlock {
  title: string;
  description: string;
  items: ContentKeyValueListBlockItem[];
}

export class ContentKeyValueListBlockItem {
  label: string;
  value: string;
}

export class ContentTabsBlock {
  title: string;
  description: string;
  tabs: ContentTabsBlockTab[];
}

export class ContentTabsBlockTab {
  name: string;
  items: ContentKeyValueListBlockItem[];
}

export class ContentDownloadActionCardsItem {
  countries: string[];
  url: string;
  title: string;
  information?: Nullable<string>;
}

export class ContentDownloadActionCardsBlock {
  items: ContentDownloadActionCardsItem[];
}

export class ContentHighlightCardBlock {
  title: string;
  description: string;
  items: ContentHighlightCardBlockItem[];
}

export class ContentHighlightCardBlockItem {
  imageUrl: string;
  title: string;
  description: string;
}

export class User {
  id: string;
  createdAt: string;
  cognitoId: string;
  firstName: string;
  lastName: string;
  country: string;
  state?: Nullable<string>;
  email: string;
  externalId?: Nullable<string>;
  legacyExternalId?: Nullable<string>;
  dob?: Nullable<string>;
  postcode?: Nullable<string>;
  addressLine1?: Nullable<string>;
  addressLine2?: Nullable<string>;
  town?: Nullable<string>;
}

export class UserBasic {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  email: string;
}

export type ContentBlockData =
  | ContentTitleBodyBlock
  | ContentTimelineBlock
  | ContentBulletListBlock
  | ContentRisksAndMitigationsBlock
  | ContentKeyValueListBlock
  | ContentTabsBlock
  | ContentYoutubeBlock
  | ContentMapBlock
  | ContentDownloadActionCardsBlock
  | ContentGalleryBlock
  | ContentHighlightCardBlock;
type Nullable<T> = T | null;
