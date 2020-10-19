import {MergeRequestStatusInCard} from "./mergerequest-status-in-card";

export type ItemConfig = {
    id: string
    title: string,
    description: string,
    url: string,
    mrs: MergeRequestStatusInCard[]
}