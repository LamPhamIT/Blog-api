import slugify from 'slugify';

export async function generateUniqueSlug(
  title: string,
  checkExists: (slug: string) => Promise<boolean>,
): Promise<string> {
  let originalSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });

  if (!originalSlug) {
    originalSlug = `item-${Date.now().toString()}`;
  }

  let slug = originalSlug;
  let count = 1;

  while (await checkExists(slug)) {
    slug = `${originalSlug}-${count.toString()}`;
    count++;
  }

  return slug;
}