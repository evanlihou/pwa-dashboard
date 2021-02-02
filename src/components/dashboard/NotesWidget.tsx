import React, { ChangeEvent, MouseEvent } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import '../../resources/css/notesWidget.scss';
import DashboardComponent from '../DashboardComponent';

const CustomEditor = require('../../libs/ckeditor5/build/ckeditor');

type NotesWidgetProps = {
  id?: string,
  name: string
}

type NotesWidgetState = {
  notes: string,
}

export default class NotesWidget extends DashboardComponent<NotesWidgetProps, NotesWidgetState> {
  private supportsLocalStorage: boolean;

  private localStorageKey: string;

  constructor(props: NotesWidgetProps) {
    super(props);
    this.state = {
      notes: '<p>Notes can go here</p>',
    };
    this.supportsLocalStorage = typeof Storage !== 'undefined';
    // ID can be used to support multiple chronometers on a dashboard while keeping
    // their respective start times
    const idString = props.id !== undefined ? props.id : '';
    this.localStorageKey = `notesContent${idString}`;
  }

  componentDidMount() {
    if (this.supportsLocalStorage && localStorage[this.localStorageKey] !== undefined) {
      this.setState({
        notes: localStorage[this.localStorageKey],
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this,no-unused-vars
  onLongPress(event: MouseEvent<HTMLDivElement>) {
    // This is behaving incorrectly on tablet, just don't use it for now.
    // const response = confirm("Are you sure you want to clear all notes?");
    // if (response === true) {
    //   this.setState({
    //     ...this.state,
    //     notes: ""
    //   });
    //   delete localStorage[this.localStorageKey];
    // }
    // event.preventDefault();
  }

  render() {
    const { notes } = this.state;
    return (
      <div className="box notification" onContextMenu={this.onLongPress.bind(this)}>
        <div className="heading">{this.props.name}</div>
        <div className="notesEditor content">
          <CKEditor
            editor={CustomEditor}
            config={{
              toolbar: ['heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'todoList',
                '|',
                'indent',
                'outdent',
                '|',
                'blockQuote',
                'insertTable',
                'undo',
                'redo'],
            }}
            data={notes}
            onReady={(editor: any) => {
              // You can store the "editor" and use when it is needed.
              editor.setData(notes);
            }}
            onChange={(_event: ChangeEvent, editor: any) => {
              const data = editor.getData();
              this.setState({
                notes: data,
              });
              localStorage[this.localStorageKey] = data;
            }}
          />
        </div>
      </div>
    );
  }
}
