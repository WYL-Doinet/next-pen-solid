import { children, JSX } from 'solid-js';

interface EditorLayoutProps {
    children: JSX.Element;
}

export default function EditorLayout(props: EditorLayoutProps) {
    const c = children(() => props.children);
    return <div class="flex-1 flex flex-col h-svh">{c()}</div>;
}
