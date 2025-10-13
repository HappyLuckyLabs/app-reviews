import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { CaseStudy, CaseStudyMetadata } from './types'

const contentDirectory = path.join(process.cwd(), 'content')

export async function getCaseStudies(): Promise<CaseStudyMetadata[]> {
  const files = fs.readdirSync(contentDirectory)

  const caseStudies = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(contentDirectory, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContent)

      return data as CaseStudyMetadata
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return caseStudies
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      ...(data as CaseStudyMetadata),
      content,
    }
  } catch (error) {
    return null
  }
}

export async function getFreeCaseStudies(): Promise<CaseStudyMetadata[]> {
  const allCaseStudies = await getCaseStudies()
  return allCaseStudies.filter((cs) => cs.isFree)
}

export async function getLockedCaseStudies(): Promise<CaseStudyMetadata[]> {
  const allCaseStudies = await getCaseStudies()
  return allCaseStudies.filter((cs) => !cs.isFree)
}
