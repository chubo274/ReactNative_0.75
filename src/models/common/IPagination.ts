export interface IMeta {
    include: any,
    custom: any,
    pagination: IPagination
}

export interface IPagination {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: { next?: string, previous?: string };
}
