export const staticContentApi = {
    get: async (slug: string) => {
        // Mock get API
        return {
            slug,
            title: slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions',
            content: `<p>Default content for ${slug}</p>`,
        }
    },
    update: async (slug: string, data: any) => {
        // Mock update API
        return { success: true }
    }
}
