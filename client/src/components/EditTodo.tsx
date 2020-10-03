import * as React from 'react';
import { Form, Button } from 'semantic-ui-react';
import Auth from '../auth/Auth';
import { getUploadUrl, uploadFile, getTodo } from '../api/todos-api';
import { TodoItem } from '../types/Todo.d';

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string;
    };
  };
  auth: Auth;
}

interface EditTodoState {
  todo: TodoItem;
  file: any;
  uploadState: UploadState;
}

export class EditTodo extends React.PureComponent<EditTodoProps, EditTodoState> {
  state: EditTodoState = {
    todo: {
      userId: '',
      createdAt: '',
      todoId: '',
      name: '',
      dueDate: '',
      done: false,
      attachmentUrl: ''
    },
    file: undefined,
    uploadState: UploadState.NoUpload
  };

  async componentDidMount() {
    const idToken = this.props.auth.getIdToken();
    const todoId = this.props.match.params.todoId;
    try {
      const todo = await getTodo(idToken, todoId);
      this.setState({ todo });
    } catch (error) {
      console.error(`Failed to fetch todo (${todoId}):  ${error.message}`);
    }
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    this.setState({
      file: files[0]
    });
  };

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!this.state.file) {
        alert('File should be selected');
        return;
      }

      this.setUploadState(UploadState.FetchingPresignedUrl);
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.todoId
      );

      this.setUploadState(UploadState.UploadingFile);
      await uploadFile(uploadUrl, this.state.file);

      alert('File was uploaded!');
    } catch (error) {
      alert('Could not upload a file: ' + error.message);
    } finally {
      this.setUploadState(UploadState.NoUpload);
    }
  };

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    });
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    );
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button loading={this.state.uploadState !== UploadState.NoUpload} type="submit">
          Upload
        </Button>
      </div>
    );
  }
}
