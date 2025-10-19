const baseUrl = "http://nas.internal:8000"

async function API_GetAccounts(): Promise<{ id: string, name: string, type: string }[]> {
    const resp = await fetch(new URL("/accounts", baseUrl))
    return await resp.json()
}

export {
    API_GetAccounts,
}