export type Job={id:string;owner:string;item_id:string;task_id:string|null;endpoint:string;status:string;data:string;created_at:string};
export const idPattern=/^[a-zA-Z0-9_-]{1,100}$/;
export function publicJob(j:Job){const d=JSON.parse(j.data);return {id:j.id,itemId:j.item_id,status:j.status,progress:d.progress||0,error:d.error,model:d.model,createdAt:j.created_at};}
