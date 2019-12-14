import React, { createContext, useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import styles from './EditFilePage.module.scss';
import { NavLink } from 'react-router-dom';
import locations from '../../routes';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import {Treebeard} from 'react-treebeard';
import SortableTree, { addNodeUnderParent, removeNodeAtPath } from 'react-sortable-tree';
import { fetchFile, createFile, updateFile } from '../../reducers/file.reducer';
import { listFiles } from '../../reducers/files.reducer';
import { MOCK_DATA } from './mock.data';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import FileTreeView from '../../components/FileTreeView';

export const Context = createContext({});

const EditFilePage = (props) => {
  const { id } = props.match.params;
  const [text, setText] = useState(MOCK_DATA);
  const [fileName, setFileName] = useState('')
  const [parser, setParser] = useState(new MarkdownIt())
  const { file } = props;

  useEffect(() => {
    if (id && !file.id) {
      props.fetchFile(id);
    } else if(file.id) {
      console.log('yo')
      setText(file.content);
      setFileName(file.name)
      props.history.push(`/files/${file.id}/edit`)
    }
  }, [file.id])

  useEffect(() => {
    props.listFiles();
  }, [])

  return (
    <>
      <div style={{ textAlign: 'right', width: '90vw', marginBottom: '20px', marginTop: '20px' }}>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <Link style={{ marginRight: '20px', display: id ? 'inline-block' : 'none' }} className={styles.btn} to={`/files/${file.id}`}>See Online</Link>
        <button onClick={() => {
          if (id) {
            props.updateFile(id, fileName, text)
          } else {
            props.createFile(fileName, text)
          }
        }} className={styles.btn}>
          Save
       </button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ height: '90vh', width: '15vw' }}>
          <FileTreeView
            files={props.files}
            createFile={(name) => {
              props.createFile(name, 'banana')
              setText('')
              setFileName(name)
            }}
            onSelectFile={(file) => {
              if (file.title !== 'docs') {
                console.log('on select file', file)
                props.history.push(`/files/${file.id}/edit`)
                setText(file.content)
                setFileName(file.name)
              }
            }}
          />
        </div>
        <div style={{ height: '90vh', width: '80vw' }}>
          <MdEditor
            value={text}
            renderHTML={(text) => parser.render(text)}
            onChange={(p) => setText(p.text)}
          />
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  listFiles: () => dispatch(listFiles()),
  fetchFile: (id) => dispatch(fetchFile(id)),
  createFile: (name, content) => dispatch(createFile(name, content)),
  updateFile: (id, name, content) => dispatch(updateFile(id, name, content)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditFilePage);