import { GetStaticProps, NextPage } from 'next'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { useState } from 'react'

interface ProjectData {
    slug: string
    frontMatter: {
        index: number
        year: number
        title: string
        subtitle: string
        description: string
        details: string
        links: string[]
        images: string[]
        tags: string[]
    }
    content: string
}

interface HomeProps {
    projects: ProjectData[]
}

const Home: NextPage<HomeProps> = ({ projects }) => {

    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)

    return (
        <>
            <h1>Daniel Arc&eacute;</h1>
            <h2>Front End Development & Interface Implementation</h2>

            <ul>
                {projects.map((project) => (
                    <li key={project.slug}>
                        <h2>{project.frontMatter.title}</h2>
                        <p>{project.frontMatter.subtitle}</p>
                        <p>{project.frontMatter.description}</p>
                        <button onClick={() => setSelectedProject(project)}>View Details</button>
                    </li>
                ))}
            </ul>
            {selectedProject && (
                <div>
                    <h3>{selectedProject.frontMatter.title}</h3>
                    <p>{selectedProject.frontMatter.details}</p>
                    <div dangerouslySetInnerHTML={{ __html: selectedProject.content }}></div>
                    <button onClick={() => setSelectedProject(null)}>Close</button>
                </div>
            )}
        </>
    )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const files = fs.readdirSync(path.join('content'))

    const projects = files.map((filename) => {
        const slug = filename.replace('.md', '')
        const markdownWithMeta = fs.readFileSync(path.join('content', filename), 'utf-8')
        const { data, content } = matter(markdownWithMeta)
        const frontMatter = {
            index: data.index as number,
            year: data.year as number,
            title: data.title as string,
            subtitle: data.subtitle as string,
            description: data.description as string,
            details: data.details as string,
            links: data.links as string[],
            images: data.images as string[],
            tags: data.tags as string[],
        };

        return {
            slug,
            frontMatter,
            content
        }
    })

    return {
        props: {
            projects,
        }
    }
}
export default Home