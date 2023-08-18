import { AppBskyEmbedRecord, RichText } from "@atproto/api";
import { Record as RecordType } from "@atproto/api/src/client/types/app/bsky/feed/post";
import cn from 'classnames';
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { Portal } from "react-portal";
import { useMutation, useQueryClient } from "react-query";
import agent from "../../Agent";
import CloseIcon from '../../assets/close.svg';
import ImageIcon from '../../assets/image.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import { newAtom } from "../../store/new";
import { userAtom } from "../../store/user";
import Blue from "../Blue/Blue";

import { lightboxAtom } from "../../store/lightbox";
import Record from "../Blue/Embed/Record";
import Button from "../Button";
import Composer from "../Composer";
import styles from './New.module.scss';

export default function NewModal(props: {}) {
    const user: any = useAtomValue(userAtom);
    const [newModal, setNewModal] = useAtom(newAtom);
    const [text, setText] = useState('');
    const queryClient = useQueryClient();
    const [lightbox, setLightbox] = useAtom(lightboxAtom);
    const isQuote = newModal.quotePost;
    const [files, setFiles] = useState<any[]>([]);
    const [fileUploadLoading, setFileUploadLoading] = useState(false);
    const { mutate, isLoading } = useMutation((d: RecordType) => agent.post(d), {
        onSuccess: d => {
            setText('');
            setNewModal({ show: false, post: null, cid: null });
            queryClient.invalidateQueries(["skyline"]);
        },
        onError: error => {
            console.error(error);
        }
    });

    const _handleSubmit = async (filesData: any[], text: string, audio: any = null) => {

        // if ((!text.length && !files.length) || isLoading || fileUploadLoading) return;
        const filesUpload = filesData;
        const rt = new RichText({ text });
        await rt.detectFacets(agent);

        let data: {
            [x: string]: any
        } = {
            createdAt: new Date().toISOString(),
            text: rt.text,
            facets: rt.facets,
            $type: 'app.bsky.feed.post',
        }
        if (isQuote) {
            if (filesUpload.length) {
                data.embed = {
                    $type: "app.bsky.embed.recordWithMedia",
                    media: {
                        $type: "app.bsky.embed.images",
                        images: filesUpload.length ? filesUpload.map(i => ({ alt: "", image: i.data.blob.original })) : undefined
                    },
                    record: {
                        $type: "app.bsky.embed.record",
                        record: {
                            cid: newModal.quotePost?.cid,
                            uri: newModal.quotePost?.uri
                        }
                    }
                } as AppBskyEmbedRecord.View;
            } else {
                data.embed = {
                    $type: "app.bsky.embed.record",
                    record: {
                        cid: newModal.quotePost?.cid,
                        uri: newModal.quotePost?.uri
                    }
                } as AppBskyEmbedRecord.View
            }
        } else {
            data.reply = {
                root: {
                    cid: newModal.cid!,
                    // @ts-ignore
                    uri: newModal.post?.uri!
                },
                parent: {
                    cid: newModal.cid!,
                    // @ts-ignore
                    uri: newModal.post.uri
                }
            };
            if (filesUpload.length) {
                // @ts-ignore
                data.embed = {
                    $type: "app.bsky.embed.images",
                    images: filesUpload.length ? filesUpload.map(i => ({ alt: "", image: i.data.blob.original })) : undefined
                }
            }
        }

        if (audio) {
            // @ts-ignore
            data.horizonAudio = audio;
            const newRt = new RichText({ text: 'Unsupported audio message. To view this message you need to use Horizon 🪁\n\nhttps://vul.my.id/horizon' });
            await newRt.detectFacets(agent);
            data.text = newRt.text;
            data.facets = newRt.facets;
            // @ts-ignore
            data.horizonText = rt.text || '\n';
        }

        // @ts-ignore
        mutate(data)
    };

    return (

        <div className={styles.modal}>
            <div className={styles.backdrop} onClick={() => setNewModal({ show: false, cid: null, post: null })}></div>
            <div className={styles.wrapper}>
                <div className={styles.postWrapper}>
                    {newModal.quotePost ? "" : <Blue isParent={true} post={newModal.post as any} className={styles.post} isCompose={true} />}
                </div>
                <div className={cn(styles.modalWrapper, { [styles.quoteWrapper]: isQuote })}>
                    <div className={styles.left}>
                        <div className={styles.avatar}>
                            <img src={user?.avatar || AvatarPlaceholder} alt="" />
                        </div>
                    </div>
                    <div className={styles.right}>
                        {/* <form onSubmit={_handleSubmit}>
                            <textarea
                                className={cn({ [styles.open]: text.length })}
                                dir="auto"
                                maxLength={254}
                                onKeyDown={_handleCtrlEnter}
                                onChange={e => setText(e.target.value.substring(0, 254))}
                                placeholder="What's on your mind?"
                                style={{resize:'vertical'}}
                                value={text}></textarea>
                            {newModal.quotePost ? <Record isQuote embed={newModal.quotePost as any} uri={newModal.quotePost.uri as string} author={newModal.quotePost.author as any} /> : ''}
                            {files.length ?
                                <div className={styles.files}>
                                    {files.map((file, index) =>
                                        <div className={styles.file} onClick={() => setLightbox({ images: [file.preview], show: true })} key={index}>
                                            <span className={styles.fileRemove} onClick={(e) => _handleRemoveFile(e, index)}>
                                                <img src={CloseIcon} alt="" />
                                            </span>
                                            <img src={file.preview} alt="" />
                                        </div>
                                    )}
                                </div>
                                : ''}
                            <div className={styles.footer}>
                                <div>
                                    {text.length ? <span>{text.length}/254</span> : ''}
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="file-input">
                                        <input multiple type='file' accept='image/jpeg,image/png' onChange={_handleFile} title="Upload Media" />
                                        <label>
                                            <img src={ImageIcon} height={28} alt="" />
                                        </label>
                                    </div>
                                    <Button type="submit" loading={isLoading || fileUploadLoading} className="btn primary" text='Post' />
                                </div>
                            </div>
                        </form> */}
                        <Composer quotePost={newModal.quotePost} onSubmit={_handleSubmit} inModal submitLoading={isLoading} />
                    </div>
                </div>
            </div>
        </div>

    );
}
