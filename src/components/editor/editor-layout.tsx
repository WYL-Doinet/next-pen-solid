import { children, JSX } from "solid-js"

interface  EditorLayoutProps {
     children: JSX.Element
}

export default function EditorLayout(props:EditorLayoutProps){
    return <div class="flex-1 flex flex-col h-svh">
            { props.children}
    </div>
}