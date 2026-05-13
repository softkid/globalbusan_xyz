import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, Heart, Eye, User, Clock, Share2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

const mockPost = {
  id: 1,
  title: "LLM 파인튜닝 경험 공유",
  content: "최근에 GPT-3.5를 우리 도메인 데이터로 파인튜닝했습니다.\n\n결과가 정말 좋네요! 특히 사내 규정이나 특수 용어를 이해하는데 큰 도움이 되었습니다. \n파인튜닝 시 데이터셋 구축에만 2주일이 걸렸지만, 그만큼 가치가 있었습니다.\n\n### 팁 1. 데이터 품질이 전부다\n양이 적더라도 고품질의 Q&A 쌍을 만드는 것이 중요합니다.\n\n### 팁 2. 하이퍼파라미터 튜닝\n에포크 수를 조절해가며 오버피팅을 방지하는 것이 핵심이었습니다.",
  author: "김AI개발자",
  tags: ["LLM", "파인튜닝", "경험공유"],
  views: 342,
  comments: [
    { id: 1, author: "이네트워킹", content: "좋은 정보 감사합니다! 데이터셋은 대략 몇 건 정도 구축하셨나요?", date: "1시간 전" },
    { id: 2, author: "김AI개발자", content: "약 500건 정도의 정제된 데이터를 사용했습니다.", date: "40분 전" },
  ],
  likes: 45,
  date: "2시간 전",
  isLiked: false,
};

export default function CommunityPostDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  const [post, setPost] = useState(mockPost); // Default to mockPost for demo
  const [commentInput, setCommentInput] = useState("");

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    setPost(prev => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다.", {
        action: { label: "로그인", onClick: () => window.location.href = getLoginUrl() }
      });
      return;
    }
    if (!commentInput.trim()) return;

    const newComment = {
      id: Date.now(),
      author: user?.name || "사용자",
      content: commentInput,
      date: "방금 전",
    };

    setPost(prev => ({
      ...prev,
      comments: [...prev.comments, newComment]
    }));
    setCommentInput("");
    toast.success("댓글이 등록되었습니다.");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl space-y-6">
        <Button 
          variant="ghost" 
          className="gap-2 text-muted-foreground hover:text-foreground pl-0"
          asChild
        >
          <Link href="/community">
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>
        </Button>

        {/* Post Content */}
        <Card className="border-0 shadow-sm border-t-4 border-t-accent rounded-t-xl">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 font-medium bg-accent/10 text-accent hover:bg-accent/20">
                  #{tag}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-3xl font-bold leading-tight mb-4">{post.title}</CardTitle>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{post.author}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {post.views}</div>
                <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {post.comments.length}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap min-h-[200px]">
              {post.content}
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button 
                variant={post.isLiked ? "default" : "outline"} 
                className={`gap-2 rounded-full px-6 ${post.isLiked ? "bg-accent text-white" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? "fill-white" : ""}`} />
                공감 {post.likes}
              </Button>
              <Button variant="outline" className="gap-2 rounded-full px-6">
                <Share2 className="w-5 h-5" />
                공유
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-0 shadow-sm mt-8">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              댓글 <span className="text-accent">{post.comments.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground font-bold mt-1">
                {user ? user.name?.charAt(0) : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 space-y-2">
                <Textarea 
                  placeholder={isAuthenticated ? "댓글을 남겨보세요..." : "댓글을 작성하려면 로그인이 필요합니다."}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="min-h-[80px] resize-y"
                  disabled={!isAuthenticated}
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" className="bg-accent hover:bg-accent/90 px-6">
                    등록
                  </Button>
                </div>
              </div>
            </form>

            <div className="border-t border-border pt-6 space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground font-bold font-sm">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="flex-1 bg-muted/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
