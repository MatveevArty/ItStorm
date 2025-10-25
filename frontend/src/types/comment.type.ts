import {UserType} from "./user.type";

/**
 * Получаемые данные комментария к статье
 */
export type CommentType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  user: UserType,
  isLikePressed?: boolean,
  isDislikePressed?: boolean,
}
