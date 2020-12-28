declare module '@ckeditor/ckeditor5-react' {
  type CKEditorProps = {editor?: any, config?: any, data?: any, onReady?: any, onChange?: any}

  // eslint-disable-next-line import/prefer-default-export
  export class CKEditor extends React.Component<CKEditorProps, {}> {
    constructor({
      editor, config, data, onReady, onChange,
    }: CKEditorProps)
  }
}
