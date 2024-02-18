import type { Actions, RequestEvent } from '@sveltejs/kit';
import * as fs from 'fs';
import { Stream } from 'node:stream';

export const actions = {
    default: async ({ request }: RequestEvent) => {
        const data = await request.formData();

        const file = data.get('file') as File;

        await fs.promises.writeFile(`static/${file.name}`, file.stream() as unknown as Stream);

        return {
            status: 200,
            body: 'Hello, world!'
        };
    }
} satisfies Actions;
