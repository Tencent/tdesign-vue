import Vue, { PropType } from 'vue';
import { UploadFile } from '@TdTypes/upload/TdUploadProps';
import { RemoveOptions } from './interface';
import TIconAdd from '../icon/add';
import IIconDelete from '../icon/delete';
import IIconUpload from '../icon/upload';
import TIconBrowse from '../icon/browse';
import TIconLoading from '../icon/loading';

export default Vue.extend({
  name: 'TImageUpload',

  components: { TIconAdd, IIconDelete, IIconUpload, TIconBrowse, TIconLoading },

  props: {
    files: {
      type: Array as PropType<Array<UploadFile>>,
    },
    loadingFile: {
      type: Object as PropType<UploadFile>,
    },
    trigger: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
    remove: {
      type: Function as PropType<(options: RemoveOptions) => void>,
    },
    multiple: Boolean,
  },

  computed: {
    showTrigger(): boolean {
      return Boolean(this.multiple || (!this.multiple && (!this.files || !this.files[0])));
    },
  },

  methods: {
    onMaskClick(e: MouseEvent) {
      !this.showTrigger && this.trigger(e);
    },
  },

  render() {
    return (
      <ul class='t-upload-card'>
        {this.files && this.files.map((file, index) => (
            <li class='t-upload-card__item'>
              <div class='t-upload-card__content'>
                  <img class='t-upload-card__image' src={file.url}/>
                  <div class='t-upload-card__mask' onClick={this.onMaskClick}>
                    {!this.multiple && (
                      <span class='t-upload-card__mask__item'>
                        <IIconUpload/>
                      </span>
                    )}
                    {/* <span class='t-upload-card__mask__item'>
                      <TIconBrowse/>
                    </span> */}
                    <span class='t-upload-card__mask__item' onClick={(e: MouseEvent) => e.stopPropagation()}>
                      <IIconDelete nativeOnClick={(e: MouseEvent) => this.remove({ e, file, index })}/>
                    </span>
                  </div>
                </div>
              <p class='t-upload-card__name'>{file.name}</p>
            </li>
        ))}
        {this.showTrigger && (
          <li class='t-upload-card__item t-is--empty' onClick={this.trigger}>
            {this.loadingFile && this.loadingFile.status === 'progress' ? (
              <div class='t-upload-card-container'>
                <TIconLoading></TIconLoading>
                <p>上传中</p>
              </div>
            ) : (
              <div class='t-upload-card-container'>
                <TIconAdd></TIconAdd>
                <p class='t-upload__small'>点击上传图片</p>
              </div>
            )}
          </li>
        )}
      </ul>
    );
  },
});
